import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { BsBell } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { IoReorderThreeOutline } from "react-icons/io5";
import { GlobalContext } from "../../contexts/GlobalContext";
import { trpc } from "../../utils/trpc";
import Avatar from "../Avatar";

const Header = () => {
  const { data, status } = useSession();

  const { push } = useRouter();

  const { setOpenModal, setToggleLeftSidebar, toggleLeftSidebar } =
    useContext(GlobalContext);

  const { data: user } = trpc.user.getCurrentUser.useQuery();

  return (
    <header className="relative flex h-24 w-full select-none items-center justify-between border-b border-gray-300 px-10 text-gray-900">
      <div
        className="cursor-pointer"
        onClick={() => setToggleLeftSidebar(true)}
      >
        <IoReorderThreeOutline className="h-8 w-8" />
      </div>
      <Link href={"/"} className="absolute left-[50%]">
        <span className="relative left-[-50%] text-5xl font-bold tracking-wide">
          BLOG
        </span>
      </Link>
      <div className="flex items-center space-x-4">
        {status === "authenticated" ? (
          <>
            <BsBell className="h-6 w-6" />
            <Link
              href={`/u/${data.user?.username}`}
              className="h-10 w-10 rounded-full bg-gray-200 ring-pink-500 ring-offset-2"
            >
              {user?.image && <Avatar size="full" url={user?.image} />}
            </Link>
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400"
            >
              <FiEdit />
              <span className="text-sm">Write</span>
            </button>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400"
            >
              Logout
            </button>
          </>
        ) : (
          <div>
            <button
              onClick={() => signIn()}
              className="flex items-center space-x-2 rounded-lg px-4 py-2 ring-1 ring-gray-400"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
