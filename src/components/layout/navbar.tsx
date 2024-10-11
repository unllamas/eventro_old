import Link from 'next/link';
import { useActiveUser, useLogin } from 'nostr-hooks';

export function Navbar() {
  const { loginWithExtension } = useLogin();
  const { activeUser } = useActiveUser();

  return (
    <header className='border-b'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-primary'>Eventro</h1>
        <nav className='hidden md:flex space-x-4'>
          <Link href='/' className='text-muted-foreground hover:text-primary'>
            Home
          </Link>
          <Link href='/home' className='text-muted-foreground hover:text-primary'>
            Events
          </Link>

          {activeUser ? (
            <Link href='/create' className='text-primary hover:text-muted-foreground'>
              Create
            </Link>
          ) : (
            <button onClick={() => loginWithExtension()}>Login</button>
          )}
        </nav>
      </div>
    </header>
  );
}
