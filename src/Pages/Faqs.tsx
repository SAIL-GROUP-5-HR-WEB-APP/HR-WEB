import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

const Faq= () => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  return (
    <div className="bg-gray-100">
     <section>
      <div className=" flex items-center justify-center gap-5 max-w-[300px] mx-auto">
      <div className="h-0.5 flex-grow bg-gradient-to-bl from-black via-gray-200 to-gray-200 mt-24"></div>
      <span className="mt-24">FAQs</span>
      <div className="mt-24 h-0.5 bg-black flex-grow  bg-gradient-to-br from-black via-gray-200  to-gray-200 "></div>
      </div>
      <h1 className="tablet:text-[2xl] tablet:max-w-[1280px] max-w-[400px] mx-auto text-[25px] font-bold text-center mt-6">Frequently asked questions</h1>
      <p className="tablet:text-[17px] tablet:max-w-[800px] text-center mt-7 leading-6 max-w-[300px] mx-auto text-[15px]">Have questions about how the platform works? We've compiled answers to help you understand our features, data security, and how we support your HR operations every step of the way.</p>
     

     <section className="tablet:max-w-[700px] max-w-[400px] mx-auto flex flex-col gap-[20px] mt-4">
     <div onClick={() => setShow1(!show1)} className="mobile:rounded-[60px]  bg-white p-4 rounded-[100px]">
      <h4 className="flex items-center font-bold tablet:text-[20px] text-[17px] text-gray-800 justify-between">How secure is employee's data on this platform?
         <span className={`${show1 ? 'rotate-180' : ''} transition-transform duration-300 bg-gray-100 p-3 rounded-[100px]` }><MdOutlineKeyboardArrowDown size={25}/></span></h4>
      <p className={`transition-all duration-300 ease-in-out ${show1 ? 'block': 'hidden'}`}>We use industry-standard encryption and secure cloud infrastructure to protect your employee records. Only authorized users have access based on role-based permissions.</p>
     </div>
       
     <div onClick={() => setShow2(!show2)} className="bg-white p-4 rounded-[100px]">
      <h4 className="flex items-center justify-between tablet:text-[20px] text-[17px] font-bold text-gray-800">Is this platform suitable for small and growing teams?
      <span className={`${show2 ? 'rotate-180' : ''} transition-transform duration-300 bg-gray-100 p-3 rounded-[100px]`}><MdOutlineKeyboardArrowDown size={25}/></span>
      </h4>
      <p className={`transtion-all duration-300 ease-in-out ${show2 ? 'block' : 'hidden'}`}>Absolutely. Whether you're a team of 5 or 500, the platform scales with your needs and offers flexible features to support growth.</p>
     </div>

     <div onClick={() => setShow3(!show3)} className="bg-white p-4 rounded-[100px]">
      <h4 className="flex items-center justify-between tablet:text-[20px] text-[17px] font-bold text-gray-800">Does the system support remote team management?
      <span className={`${show3 ? 'rotate-180' : ''} transition-transform duration-300 bg-gray-100 p-3 rounded-[100px]`} ><MdOutlineKeyboardArrowDown size={25}/></span>
      </h4>
      <p className={`transition-all duration-300 ease-in-out ${show3 ? 'block': 'hidden'}`}>Yes, our system supports remote check-ins, time tracking, and digital approvals, making it perfect for hybrid and remote teams.</p>
     </div>

     <div onClick={() => setShow4(!show4)} className="bg-white p-4 rounded-[100px]">
      <h4 className="flex items-center justify-between tablet:text-[20px] text-[17px] font-bold text-gray-800">Can employees access their own records or payslips?
      <span className={`${show4 ? 'rotate-180' : ''} transition-transform duration-300 bg-gray-100 p-3 rounded-[100px]`}><MdOutlineKeyboardArrowDown size={25}/></span>
      </h4>
      <p className={`transition-all duration-300 ease-in-out ${show4 ? 'block': 'hidden'}`}>Yes, employees have secure self-service access to view and download their payslips, update personal information, and check leave balances.</p>
     </div>

     <div onClick={() => setShow5(!show5)} className="bg-white p-4 rounded-[100px]">
      <h4 className="flex items-center justify-between tablet:text-[20px] text-[17px] font-bold text-gray-800">What integrations are available?
      <span className={`${show5 ? 'rotate-180' : ''} transition-transform duration-300 bg-gray-100 p-3 rounded-[100px]`}><MdOutlineKeyboardArrowDown size={25}/></span>
      </h4>
      <p className={`transition-all duration-300 ease-in-out ${show5 ? 'block': 'hidden'}`}>We currently support integrations with email, Slack, Google Calendar, and select biometric devices. More integrations are added regularly.

</p>
     </div>
     </section>
       <section className="bg-white p-6 rounded-[15px] flex flex-col tablet:flex-row items-center mt-[35px] justify-between tablet:max-w-[700px] max-w-[400px] mx-auto">
        <main>
          <small className="text-[15px] text-blue-800">Still have question?</small>
          <h4 className="font-bold tablet:text-[25px] text-[18px]">Reach out to our team</h4>
        </main>
        <main>
          <button className="bg-blue-800 text-white p-3 rounded-[100px]">Talk to HR Expert</button>
        </main>
       </section>
     </section>
    </div>
  );
};

export default Faq;
