import { ComponentType } from 'react';
import Link from 'next/link';

import { Layout } from '../components/Layout';
import { NewBoard } from '../modules/Board/NewBoard';

export default function Home() {
  return (
    <section className="max-w-5xl px-4 mx-auto mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-pencil">All Boards</h2>

        <NewBoard />
      </div>

      <div className="grid mt-10 gap-x-8 gap-y-6 grid-cols-list">
        {new Array(6).fill('oh').map((_, index) => (
          <Link key={index} href={`/board/${index}`} passHref>
            <a className="flex flex-col p-3 rounded-lg shadow">
              <div className="rounded-lg bg-corn-blue h-28"></div>
              <p className="mt-2 text-sm">Devchallenges Board</p>
              <div className="flex items-center">
                <div className="w-8 h-8 mt-3 mr-3 rounded-lg bg-corn-blue"></div>
                <div className="w-8 h-8 mt-3 mr-3 rounded-lg bg-corn-blue"></div>
                <div className="w-8 h-8 mt-3 mr-3 rounded-lg bg-corn-blue"></div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}

Home.getLayout = (page: ComponentType) => <Layout>{page}</Layout>;
