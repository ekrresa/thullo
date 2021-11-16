import { ComponentType } from 'react';

import { Layout } from '../components/Layout';
import { NewBoard } from '../modules/Board/NewBoard';

export default function Home() {
  return (
    <section className="mt-16 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-pencil">All Boards</h2>

        <NewBoard />
      </div>

      <div className="grid gap-x-8 gap-y-6 grid-cols-200 mt-10">
        {new Array(6).fill('oh').map((_, index) => (
          <div key={index} className="flex flex-col p-3 rounded-lg shadow">
            <div className="bg-corn-blue h-28 rounded-lg"></div>
            <p className="mt-2 text-sm">Devchallenges Board</p>
            <div className="flex items-center">
              <div className="bg-corn-blue w-8 h-8 mr-3 mt-3 rounded-lg"></div>
              <div className="bg-corn-blue w-8 h-8 mr-3 mt-3 rounded-lg"></div>
              <div className="bg-corn-blue w-8 h-8 mr-3 mt-3 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

Home.getLayout = (page: ComponentType) => <Layout>{page}</Layout>;
