import { Search } from '@/components/core/search';
import { Header } from '@/components/header';

export default function Home() {
  return (
    <main className="container m-auto">
      <Header>
        <Search />
      </Header>
    </main>
  );
}
