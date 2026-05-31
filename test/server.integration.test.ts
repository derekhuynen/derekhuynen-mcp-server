import { describe, it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { buildServer } from '../src/core/server.js';
import { fixtureProfile } from './fixtures/profile.fixture.js';

async function connect() {
  const server = buildServer(fixtureProfile);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: 'test', version: '1.0.0' });
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  return { client };
}

describe('MCP server integration', () => {
  it('lists all six tools', async () => {
    const { client } = await connect();
    const { tools } = await client.listTools();
    const names = tools.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        'get_contact',
        'get_experience',
        'get_profile',
        'get_projects',
        'get_skills',
        'search_experience',
      ].sort(),
    );
  });

  it('calls get_profile and returns Derek', async () => {
    const { client } = await connect();
    const res = await client.callTool({ name: 'get_profile', arguments: {} });
    const text = (res.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toContain('Derek Huynen');
  });

  it('calls get_experience with a skill filter', async () => {
    const { client } = await connect();
    const res = await client.callTool({ name: 'get_experience', arguments: { skill: 'rag' } });
    const text = (res.content as Array<{ type: string; text: string }>)[0].text;
    expect(text).toContain('neudesic-pge-genai-chatbot');
  });

  it('exposes the profile resources', async () => {
    const { client } = await connect();
    const { resources } = await client.listResources();
    expect(resources.map((r) => r.uri)).toContain('profile://summary');
  });

  it('exposes the recruiter_pitch prompt', async () => {
    const { client } = await connect();
    const { prompts } = await client.listPrompts();
    expect(prompts.map((p) => p.name)).toContain('recruiter_pitch');
  });

  it('reads the profile://summary resource', async () => {
    const { client } = await connect();
    const res = await client.readResource({ uri: 'profile://summary' });
    const c0 = res.contents[0]!;
    expect(c0.uri).toBe('profile://summary');
    expect(c0.text).toContain('Senior AI');
  });

  it('gets the recruiter_pitch prompt with the role interpolated', async () => {
    const { client } = await connect();
    const res = await client.getPrompt({
      name: 'recruiter_pitch',
      arguments: { role: 'Staff AI Engineer' },
    });
    const msg = res.messages[0]!;
    const text = (msg.content as { type: string; text: string }).text;
    expect(text).toContain('Staff AI Engineer');
  });
});
