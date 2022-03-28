import React from "react";
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackArrow = () => {
  return (
    <Link href="/">
      <div className="z-60 rounded-full bg-white p-2 shadow-md fixed top-[100px] left-8 md:hidden">
        <ArrowBackIcon />
      </div>
    </Link>
  );
};

export default BackArrow;
