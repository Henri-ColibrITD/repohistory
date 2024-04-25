import Download from '@/components/Icons/Download';
import Fork from '@/components/Icons/Fork';
import Issue from '@/components/Icons/Issue';
import Star from '@/components/Icons/Star';
import supabase from '@/utils/supabase';
import { Link } from '@nextui-org/react';

async function prepareDataDownload(repoName: string) {
  const { data: data, error: error } = await supabase
    .from('repository_traffic')
    .select('*')
    .eq('full_name', repoName)
    .order('date', { ascending: true });
  return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
}

export default async function Overview({ repo }: { repo: any }) {
  const downloadableData = await prepareDataDownload(repo.full_name);

  const { data: clonesData, error: clonesError } = await supabase
    .from('repository_traffic')
    .select('*')
    .eq('full_name', repo.full_name)
    .order('date', { ascending: true })
    .select('clones_count');

  const clonesTotal = clonesError
    ? 0
    : clonesData.reduce((acc, row) => acc + row.clones_count, 0);

  const { data: viewsData, error: viewsError } = await supabase
    .from('repository_traffic')
    .select('*')
    .eq('full_name', repo.full_name)
    .order('date', { ascending: true })
    .select('views_count');

  const viewsTotal = viewsError
    ? 0
    : viewsData.reduce((acc, row) => acc + row.views_count, 0);

  return (
    <div className="flex flex-col gap-5 xl:w-1/3">
      <div
        className="flex h-2/3 flex-col gap-4 rounded-medium border
        border-[#303031] bg-[#111112] p-5 text-white"
      >
        <h1 className="text-3xl font-bold">{repo?.name}</h1>
        <div>{repo?.description}</div>
        <div className="flex gap-1">
          <Link
            isExternal
            isBlock
            color="foreground"
            href={`${repo?.html_url}/stargazers`}
            className="flex items-center gap-2 text-white"
          >
            <Star />
            {repo?.stargazers_count}
          </Link>
          <Link
            isExternal
            isBlock
            color="foreground"
            href={`${repo?.html_url}/forks`}
            className="flex items-center gap-2 text-white"
          >
            <Fork />
            {repo?.forks_count}
          </Link>
          <Link
            isExternal
            isBlock
            color="foreground"
            href={`${repo?.html_url}/issues`}
            className="flex items-center gap-2 text-white"
          >
            <Issue />
            {repo?.open_issues_count}
          </Link>
          <Link 
            isBlock 
            className='flex items-right gap-2 text-white'
            href={downloadableData}
            download="repo-data.json"
          >
            <Download/>
            Download raw data
          </Link>
        </div>
      </div>

      <div className="flex h-1/3 gap-5">
        <div
          className="flex w-1/2 flex-col justify-center gap-3
            rounded-medium border border-[#303031] bg-[#111112] p-5 text-white"
        >
          <div className="text-center font-semibold ">Total Clones</div>
          <div className="text-center text-3xl font-bold">{clonesTotal}</div>
        </div>
        <div
          className="flex w-1/2 flex-col justify-center gap-3
            rounded-medium border border-[#303031] bg-[#111112] p-5 text-white"
        >
          <div className="text-center font-semibold">Total Views</div>
          <div className="text-center text-3xl font-bold">{viewsTotal}</div>
        </div>
      </div>
    </div>
  );
}
