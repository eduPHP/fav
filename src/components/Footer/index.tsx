import Link from 'next/link';

export default function Footer() {
  return (
    <div className="w-full min-h-[4rem] mt-6 bg-gray-600 flex items-center justify-center gap-1 text-sm">
      made with <span className="text-red-600">❤</span> by
      <Link href="https://rdo.blog.br">
        <a className="text-blue-300">edu@rdo</a>
      </Link>
    </div>
  );
}
