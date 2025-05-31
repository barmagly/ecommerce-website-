import React from 'react';

const AccountBreadcrumb = () => {
  return (
    <div className="flex justify-between items-start self-stretch mb-20 mx-[135px]">
      <div className="flex shrink-0 items-center pr-[3px]">
        <span className="text-black text-sm mr-3.5">
          {"الرئيسية"}
        </span>
        <div className="bg-[#00000080] w-[5px] h-[11px] mr-[13px]">
        </div>
        <span className="text-black text-sm">
          {"حسابي"}
        </span>
      </div>
      <span className="text-black text-sm">
        {"مرحباً! محمد أحمد"}
      </span>
    </div>
  );
};

export default AccountBreadcrumb; 