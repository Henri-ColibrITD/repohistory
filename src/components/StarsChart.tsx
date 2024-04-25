import LineChart from '@/components/LineChart';
import processStarData from '@/utils/processStarsData';
import { Octokit } from 'octokit';

export async function startsData(octokit: Octokit, repoName: string, starCount: number) {
  const fetchPromises: Promise<any>[] = [];
  const totalStars = Math.ceil(starCount / 100);
  for (let page = 1; page <= totalStars; page += 1) {
    fetchPromises.push(
      octokit.request(`GET /repos/${repoName}/stargazers`, {
        per_page: 100,
        page,
        headers: {
          accept: 'application/vnd.github.v3.star+json',
        },
      }),
    );
  }

  const results = await Promise.allSettled(fetchPromises);

  const stars: any[] = [];
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const filteredData = result.value.data.map((d: any) => d.starred_at);
      stars.push(...filteredData);
    }
  });

  return {
    counts: processStarData(stars, false),
    growth: processStarData(stars, true)
  } 
}

export default async function StarsChart({
  octokit,
  repo,
}: {
  octokit: any;
  repo: any;
}) {
  const data = await startsData(octokit, repo.full_name, repo.stargazer_count)

  return <LineChart data={data} />;
}
