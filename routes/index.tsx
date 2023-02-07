import { Head } from "$fresh/runtime.ts";
import TimeTable from "../islands/TimeTable.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="min-h-screen bg-gray-100 flex items-center justify-center">
        <div class="max-w-md w-full">
          <TimeTable />
        </div>
      </div>
    </>
  );
}
