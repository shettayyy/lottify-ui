import { Header } from '@/components/header';
import { Search } from '@/components/search';

export default function Home() {
  return (
    <main className="container m-auto">
      <Header>
        <Search />
      </Header>
    </main>
  );
}
