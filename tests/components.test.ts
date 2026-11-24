import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Press from '../src/components/Press.astro';
import Technical from '../src/components/Technical.astro';
import { getContent } from '../src/lib/content';
import type { Content } from '../src/content/types';

const withShared = (patch: Partial<Content['shared']>): Content => {
  const c = getContent('en');
  return { ...c, shared: { ...c.shared, ...patch } };
};

const render = async (component: any, c: Content) =>
  (await AstroContainer.create()).renderToString(component, { props: { c } });

test('with no quotes and no confirmed shows, the press section is not rendered', async () => {
  const html = await render(Press, withShared({ press: [], shows: [] }));
  expect(html).not.toContain('<h2');
  expect(html).not.toContain('id="press"');
});

test('confirmed shows are listed, and a show without venue leaves no empty cell', async () => {
  const html = await render(
    Press,
    withShared({ shows: [{ date: '2025-12-06', city: 'Nantes', confirmed: true }] }),
  );
  expect(html).toContain('data-shows');
  expect(html).toContain('06.12.2025');
  expect(html).not.toMatch(/<span[^>]*>\s*<\/span>/);
});

test('the set length appears once it is known', async () => {
  const html = await render(Technical, withShared({ setLengthMinutes: 35 }));
  expect(html).toContain('data-field="set-length"');
  expect(html).toContain('35 minutes');
});
