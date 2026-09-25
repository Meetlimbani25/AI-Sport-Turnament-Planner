import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';
import { LocalIndex } from 'vectra';
import { Document } from '../models/index.js';

const vectorStorePath = path.join(process.cwd(), 'uploads', 'vector_store');
const index = new LocalIndex(vectorStorePath);

// Generate embeddings: uses OpenAI API if key is available, else generates deterministic vector
async function getEmbedding(text) {
  const apiKey = process.env.AI_API_KEY;
  if (apiKey && process.env.AI_PROVIDER === 'openai') {
    try {
      const OpenAI = (await import('openai')).default;
      const openai = new OpenAI({ apiKey });
      const res = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text
      });
      return res.data[0].embedding;
    } catch (err) {
      console.warn('OpenAI embedding failed, falling back to local vector:', err.message);
    }
  }

  // Fallback vector generator for testing / offline mode (dimension 384)
  const vec = new Array(384).fill(0);
  const clean = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = clean.split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let hash = 0;
    for (let j = 0; j < word.length; j++) {
      hash = (hash << 5) - hash + word.charCodeAt(j);
      hash |= 0;
    }
    const idx = Math.abs(hash) % 384;
    vec[idx] += 1;
  }
  // Normalize vector
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0)) || 1;
  return vec.map(v => v / norm);
}

// Ingest uploaded document: parse text, chunk, embed, index in vectra
export async function ingest(document) {
  try {
    if (!await index.isIndexCreated()) {
      await index.createIndex();
    }

    const filePath = document.path;
    let rawText = '';

    if (!fs.existsSync(filePath)) {
      console.warn(`File not found at path: ${filePath}`);
      await Document.update({ status: 'Failed' }, { where: { id: document.id } });
      return { documentId: document.id, status: 'Failed', reason: 'File not found' };
    }

    if (filePath.toLowerCase().endsWith('.pdf')) {
      const buffer = fs.readFileSync(filePath);
      const parser = new PDFParse({});
      await parser.load(buffer);
      const textObj = await parser.getText();
      rawText = textObj.text || '';
    } else {
      rawText = fs.readFileSync(filePath, 'utf8');
    }

    if (!rawText.trim()) {
      await Document.update({ status: 'Empty' }, { where: { id: document.id } });
      return { documentId: document.id, status: 'Empty' };
    }

    // Chunk text into 400-character segments
    const chunks = rawText.match(/[\s\S]{1,400}/g) || [rawText];

    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i].trim();
      if (!chunkText) continue;

      const vector = await getEmbedding(chunkText);
      await index.insertItem({
        vector,
        metadata: {
          docId: document.id,
          docName: document.name,
          sport: document.sport || 'General',
          chunkIndex: i,
          text: chunkText
        }
      });
    }

    await Document.update({ status: 'Indexed' }, { where: { id: document.id } });
    return { documentId: document.id, status: 'Indexed', chunkCount: chunks.length };
  } catch (err) {
    console.error('RAG Ingest error:', err);
    await Document.update({ status: 'Failed' }, { where: { id: document.id } });
    return { documentId: document.id, status: 'Failed', error: err.message };
  }
}

// Retrieve relevant document passages given a query and sport filter
export async function retrieve(query, sport = '') {
  try {
    if (!query || !await index.isIndexCreated()) return [];

    const queryVector = await getEmbedding(query);
    const results = await index.queryItems(queryVector, query, 5);

    if (!results || results.length === 0) return [];

    return results
      .filter(res => res.score > 0.1)
      .map(res => {
        const md = res.item?.metadata || {};
        return `[Doc: ${md.docName || 'Rulebook'} (${md.sport || 'General'})]: ${md.text}`;
      });
  } catch (err) {
    console.error('RAG Retrieve error:', err);
    return [];
  }
}
