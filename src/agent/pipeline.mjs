import { loadPosts } from "./data.mjs";
import { planQuery } from "./planner.mjs";
import { retrievePosts, clusterPosts } from "./retrieval.mjs";
import { interpretDiscourse } from "./interpreter.mjs";
import { critiqueReport } from "./critic.mjs";

function buildTraceStage(name, payload) {
  return {
    name,
    timestamp: new Date().toISOString(),
    payload
  };
}

export async function runAgentDesignPipeline(topic) {
  const posts = await loadPosts();
  const trace = [];

  const plan = planQuery(topic);
  trace.push(buildTraceStage("planner", plan));

  const retrievedPosts = retrievePosts(posts, plan);
  trace.push(
    buildTraceStage("retrieval", {
      resultCount: retrievedPosts.length,
      posts: retrievedPosts.map((post) => ({
        id: post.id,
        author: post.author,
        score: post.retrieval.score,
        tags: post.tags
      }))
    })
  );

  const clusters = clusterPosts(retrievedPosts);
  trace.push(
    buildTraceStage("clustering", {
      clusters: clusters.map((cluster) => ({
        theme: cluster.theme,
        postIds: cluster.posts.map((post) => post.id)
      }))
    })
  );

  const report = interpretDiscourse(plan, retrievedPosts, clusters);
  trace.push(buildTraceStage("interpreter", report));

  const critic = critiqueReport(report, retrievedPosts);
  trace.push(buildTraceStage("critic", critic));

  return {
    query: topic,
    plan,
    retrievedPosts,
    clusters,
    report,
    critic,
    trace
  };
}
