import BarChart from '@/components/BarChart';
import supabase from '@/utils/supabase';

const datasets = (label: string, data: any[], color: string) => ({
  label,
  data,
  backgroundColor: color,
  borderRadius: 999,
  barPercentage: 0.7,
  maxBarThickness: 10,
});

export default async function TrafficCharts({
  fullName,
}: {
  fullName: string;
}) {
  const { data: trafficData, error } = await supabase
    .from('repository_traffic')
    .select('*')
    .eq('full_name', fullName)
    .order('date', { ascending: true });

  const dates = error ? [] :  trafficData.map((item) => item.date);
  const viewsCounts = error ? [] :  trafficData.map((item) => item.views_count);
  const uniqueViewsCounts = error ? [] :  trafficData.map((item) => item.unique_views_count);
  const clonesCounts = error ? [] :  trafficData.map((item) => item.clones_count);
  const uniqueClonesCounts = error ? [] :  trafficData.map((item) => item.unique_clones_count);

  return (
    <>
      <BarChart
        title="Git Clones"
        primaryLabel="Unique Cloners"
        secondaryLabel="Clones"
        data={{
          labels: dates,
          datasets: [
            datasets('Unique Cloners', uniqueClonesCounts, '#62C3F8'),
            datasets('Clones', clonesCounts, '#315C72'),
          ],
        }}
      />
      <BarChart
        title="Visitors"
        primaryLabel="Unique Visitors"
        secondaryLabel="Views"
        data={{
          labels: dates,
          datasets: [
            datasets('Unique Visitors', uniqueViewsCounts, '#62C3F8'),
            datasets('Views', viewsCounts, '#315C72'),
          ],
        }}
      />
    </>
  );
}
