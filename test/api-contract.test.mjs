// These tests verify the supplied mock only. They do NOT grade the application.
import test from 'node:test';import assert from 'node:assert/strict';
import {createApi,accounts} from '../src/mock-api.mjs';
test('mock scopes overlapping IDs and permissions',async()=>{
  const api=createApi();const a=await api.list(accounts[0]);const b=await api.list(accounts[2]);
  assert.equal(a.records[0].id,b.records[0].id);assert.notEqual(a.records[0].title,b.records[0].title);
  await assert.rejects(api.approve(accounts[0],'1'),e=>e.status===403);
});
test('mock exposes a recoverable failure',async()=>{
  const api=createApi();api.failNext(503);
  await assert.rejects(api.list(accounts[0]),e=>e.status===503);
});
