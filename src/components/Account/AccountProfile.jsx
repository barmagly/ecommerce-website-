import React, { useState } from 'react';

const AccountProfile = () => {
  const [input1, onChangeInput1] = useState('');
  const [input2, onChangeInput2] = useState('');
  const [input3, onChangeInput3] = useState('');
  const [input4, onChangeInput4] = useState('');
  const [input5, onChangeInput5] = useState('');
  const [input6, onChangeInput6] = useState('');
  const [input7, onChangeInput7] = useState('');

  return (
    <div className="flex flex-1 flex-col items-start bg-white py-10 rounded" 
      style={{ boxShadow: "0px 1px 13px #0000000D" }}>
      <span className="text-[#DB4444] text-xl font-bold mb-4 ml-20">
        {"تعديل الملف الشخصي"}
      </span>
      <div className="flex items-start self-stretch mb-6 mx-20 gap-3">
        <div className="flex flex-1 flex-col items-start gap-2">
          <span className="text-black text-base">
            {"الاسم الأول"}
          </span>
          <input
            placeholder={"محمد"}
            value={input1}
            onChange={(event) => onChangeInput1(event.target.value)}
            className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
          />
        </div>
        <div className="flex flex-1 flex-col items-start gap-2">
          <span className="text-black text-base">
            {"الاسم الأخير"}
          </span>
          <input
            placeholder={"أحمد"}
            value={input2}
            onChange={(event) => onChangeInput2(event.target.value)}
            className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
          />
        </div>
      </div>
      <div className="flex items-start self-stretch mb-6 mx-20 gap-3">
        <div className="flex flex-1 flex-col items-start gap-2">
          <span className="text-black text-base">
            {"البريد الإلكتروني"}
          </span>
          <input
            placeholder={"example@gmail.com"}
            value={input3}
            onChange={(event) => onChangeInput3(event.target.value)}
            className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
          />
        </div>
        <div className="flex flex-1 flex-col items-start gap-2">
          <span className="text-black text-base">
            {"العنوان"}
          </span>
          <input
            placeholder={"القاهرة، مصر"}
            value={input4}
            onChange={(event) => onChangeInput4(event.target.value)}
            className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
          />
        </div>
      </div>
      <div className="flex flex-col self-stretch mb-6 mx-20 gap-4">
        <div className="flex flex-col items-start self-stretch gap-2">
          <span className="text-black text-base">
            {"تغيير كلمة المرور"}
          </span>
          <input
            placeholder={"كلمة المرور الحالية"}
            value={input5}
            onChange={(event) => onChangeInput5(event.target.value)}
            className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
          />
        </div>
        <input
          placeholder={"كلمة المرور الجديدة"}
          value={input6}
          onChange={(event) => onChangeInput6(event.target.value)}
          className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
        />
        <input
          placeholder={"تأكيد كلمة المرور الجديدة"}
          value={input7}
          onChange={(event) => onChangeInput7(event.target.value)}
          className="self-stretch text-black bg-neutral-100 text-base py-[13px] pl-4 pr-8 rounded border-0"
        />
      </div>
      <div className="flex flex-col items-end self-stretch">
        <div className="flex items-center mr-20 gap-[34px]">
          <span className="text-black text-base">
            {"إلغاء"}
          </span>
          <button className="flex flex-col shrink-0 items-start bg-[#DB4444] text-left py-4 px-12 rounded border-0"
            onClick={() => alert("تم الحفظ!")}>
            <span className="text-[#F9F9F9] text-base font-bold">
              {"حفظ التغييرات"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile; 