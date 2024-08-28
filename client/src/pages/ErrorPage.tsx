import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <main className="min-h-screen w-full flex flex-col justify-center items-center bg-[#1A2238] text-white">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <Link to="/">Go Home</Link>
    </main>
  );
}

export default ErrorPage;
