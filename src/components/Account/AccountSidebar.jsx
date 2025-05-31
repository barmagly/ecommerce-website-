import React from 'react';

const AccountSidebar = () => {
  return (
    <div className="flex flex-col shrink-0 items-start mr-[100px]">
      <span className="text-black text-base font-bold mb-4">
        {"إدارة حسابي"}
      </span>
      <div className="flex flex-col items-start mb-6 ml-[35px] gap-2">
        <span className="text-[#DB4444] text-base">
          {"الملف الشخصي"}
        </span>
        <span className="text-black text-base">
          {"دفتر العناوين"}
        </span>
        <span className="text-black text-base">
          {"خيارات الدفع"}
        </span>
      </div>
      <span className="text-black text-base font-bold mb-4">
        {"طلباتي"}
      </span>
      <div className="flex flex-col items-start mb-4 mx-[35px] gap-2">
        <span className="text-black text-base">
          {"المرتجعات"}
        </span>
        <span className="text-black text-base">
          {"الإلغاءات"}
        </span>
      </div>
      <span className="text-black text-base font-bold">
        {"المفضلة"}
      </span>
    </div>
  );
};

export default AccountSidebar; 