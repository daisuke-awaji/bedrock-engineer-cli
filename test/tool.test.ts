import { tavilySearch } from "../src/tools/tools";

test.skip("tavilySearch", async () => {
  console.log(process.env.TAVILY_API_KEY);
  const res = await tavilySearch("tavily");
  expect(res.length).toBeGreaterThan(1);
});
