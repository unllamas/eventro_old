import { EventFeature } from '@/feature/event';

export default function Page(props: { params: { id: string } }) {
  const { params } = props;

  return (
    <>
      <EventFeature id={params?.id} />
    </>
  );
}
