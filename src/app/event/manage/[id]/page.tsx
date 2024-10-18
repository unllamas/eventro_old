import { ManageFeature } from '@/feature/manage';

export default function Page(props: { params: { id: string } }) {
  const { params } = props;

  return (
    <>
      <ManageFeature id={params?.id} />
    </>
  );
}
