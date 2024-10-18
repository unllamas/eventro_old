import { CheckIn } from '@/feature/check-in';

export default function Page(props: { params: { id: string } }) {
  const { params } = props;

  return (
    <>
      <CheckIn id={params?.id} />
    </>
  );
}
