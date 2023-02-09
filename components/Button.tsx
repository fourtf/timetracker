import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class="flex gap-2 px-2 py-1 border(indigo-600 2) bg-gray-50 hover:bg-gray-200 rounded-md disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed"
    />
  );
}
