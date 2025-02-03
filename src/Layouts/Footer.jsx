// import { MdMarkEmailRead } from "react-icons/md";
// import { useState } from "react";

// const Footer = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Function to open modal
//     const handleOpenModal = () => {
//       setIsModalOpen(true);
//     };

//     // Function to close modal
//     const handleCloseModal = () => {
//       setIsModalOpen(false);
//     };
//   return (
//     <footer>
//       <div
//         className="flex flex-col  md:flex-row justify-between items-center text-white  shadow-lg  px-3"
//         style={{
//           backgroundColor: "#2196f3",
//           // background: "black",
//         }}
//       >
//         <div className="md:mb-0 text-sm md:text-base pt-3">
//           <p>
//             Copyright © 2016-2018{" "}
//             <a
//               href="https://www.aceventura.in"
//               target="_blank"
//               rel="noopener noreferrer"
//               className=" font-bold hover:underline"
//               style={{ color: "#C03078" }}
//             >
//               Aceventura Services
//             </a>
//             . All rights reserved.
//           </p>
//         </div>

//         <div className=" md:mb-0 text-sm md:text-base pt-3">
//           <p>
//             <a
//               href="/terms-and-conditions"
//               className="text-white no-underline hover:underline "
//             >
//               Terms and conditions
//             </a>
//           </p>
//         </div>
//         <div className="text-sm md:text-base">
//           <p>
//             <a
//               href="/contact-support"
//               className="no-underline text-white flex items-center justify-center md:justify-start hover:underline pt-3"
//             >
//               <MdMarkEmailRead className="text-white text-lg mr-2 " />
//               Contact for app support
//             </a>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import { MdMarkEmailRead } from "react-icons/md";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <footer>
      <div
        className="flex flex-col md:flex-row justify-between items-center text-white shadow-lg px-3"
        style={{ backgroundColor: "#2196f3" }}
      >
        <div className="md:mb-0 text-sm md:text-base pt-3">
          <p>
            Copyright © 2016-2018{" "}
            <a
              href="https://www.aceventura.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:underline"
              style={{ color: "#C03078" }}
            >
              Aceventura Services
            </a>
            . All rights reserved.
          </p>
        </div>

        <div className="md:mb-0 text-sm md:text-base pt-3">
          <p>
            <button
              onClick={handleOpenModal}
              className="text-white hover:bg-transparent no-underline hover:underline"
            >
              Terms and conditions
            </button>
          </p>
        </div>

        <div className="text-sm md:text-base">
          <p>
            <a
              href="mailto:supportsacs@aceventura.in"
              className="no-underline text-white flex items-center justify-center md:justify-start hover:underline pt-3"
            >
              <MdMarkEmailRead className="text-white text-lg mr-2" />
              Contact for app support
            </a>
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-3 rounded-md w-11/12 md:w-[60%] max-h-[80%] overflow-y-auto shadow-lg">
            <div className="flex justify-between ">
              <h4 className="text-xl text-gray-700  ">
                Online Fees Payments - TERMS & CONDITIONS
              </h4>
              <RxCross1
                className="float-end relative  mt-1 right-2 text-xl text-red-600 hover:cursor-pointer hover:bg-red-100"
                type="button"
                // className="btn-close text-red-600"
                onClick={handleCloseModal}
              />
            </div>
            <div
              className=" relative  mb-3 h-1 w-[100%] mx-auto bg-red-700"
              style={{
                backgroundColor: "#C03078",
              }}
            ></div>
            <p className="mb-4">
              This online payment system is provided by{" "}
              <span className="font-semibold">
                ST. ARNOLD'S CENTRAL SCHOOL (SACS)
              </span>{" "}
              <span className="font-semibold">
                {" "}
                (Through its authorized online payment enabler QwikFee).{" "}
              </span>{" "}
              <span className="font-semibold">
                ST. ARNOLD'S CENTRAL SCHOOL (SACS)
              </span>{" "}
              may update these terms from time to time and any changes will be
              effective immediately on being set out here. Please ensure you are
              aware of the current terms.
            </p>

            <h3 className="text-lg font-semibold mt-4 underline">
              Terms & Conditions
            </h3>
            <p className="mb-4">
              Please read these terms carefully before using the online payment
              facility. Using the online payment facility on this website
              indicates that you accept these terms. If you do not accept these
              terms, do not use this facility.
            </p>

            <h6 className="  font-semibold ">
              All payments are subject to the following conditions:-
            </h6>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                If the Customer leaves{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                before they completely utilizing the service, there shall be no
                entitlement to a refund of Fees and related payments.
              </li>
              <li>
                Refunds, if applicable, at the discretion of the Management,
                will only be made as per the sources of debit/credit card used
                for the original transaction. For the avoidance of doubt nothing
                in this Policy shall require{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>
                to refund the Fees (or part thereof) unless such Fees (or part
                thereof) have previously been paid.
              </li>
              <li>
                We cannot accept liability for a payment not reaching the
                correct{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                account due to you quoting incorrect details. Neither can we
                accept liability if payment is refused or declined by the
                credit/debit card supplier for any reason.
              </li>
              <li>
                If the card supplier declines payment,{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                is under no obligation to bring this fact to your attention. You
                should check with your bank/credit/debit card supplier that
                payment has been deducted from your account.
              </li>
              <li>
                In no event will{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                be liable for any damages whatsoever arising out of the use,
                inability to use, or the results of use of this site, any
                websites linked to this site, or the materials or information
                contained at any or all such sites, whether based on warranty,
                contract, tort, or any other legal theory and whether or not
                advised of the possibility of such damages.
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-4 underline">
              Refund Policy
            </h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                If the Customer leaves{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                before completely utilizing the service, there shall be no
                entitlement to a refund of Fees and related payments.
              </li>
              <li>
                Refunds, if applicable, at the discretion of the Management,
                will only be made as per the sources of debit/credit card used
                for the original transaction. For the avoidance of doubt nothing
                in this Policy shall require{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>
                to refund the Fees (or part thereof) unless such Fees (or part
                thereof) have previously been paid.
              </li>
              {/* <li>
                For the avoidance of doubt, nothing in this Policy shall require{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                to refund the Fees (or part thereof) unless such Fees (or part
                thereof) have previously been paid.
              </li> */}
            </ul>

            <h3 className="text-lg font-semibold mt-4 underline">
              Privacy Policy
            </h3>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                respects and protects the privacy of individuals accessing its
                services. Individually identifiable information about the user
                is not wilfully disclosed to any third party without the user’s
                permission, as covered in this privacy policy.
              </li>
              <li>
                This Privacy Policy describes{" "}
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>
                's treatment of personally identifiable information. The website
                does not collect unique information (such as name, email
                address, age, gender, etc.) unless the user specifically and
                knowingly provides such information.
              </li>
              <li>
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                may, from time to time, send emails or other communication to
                inform users about services, features, functionality, and
                content offered by the school or to seek voluntary information
                from the users.
              </li>
              <li>
                <span className="font-semibold">
                  ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                </span>{" "}
                will release specific personal information about the user only
                if required in the following circumstances:
                <ul className="list-disc list-inside pl-6 mt-2">
                  <li>
                    To comply with any valid legal process such as a search
                    warrant, statute, or court order.
                  </li>
                  <li>
                    If the user’s actions on the website violate the Terms of
                    Service or any of{" "}
                    <span className="font-semibold">
                      ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                    </span>
                    's guidelines for specific services.
                  </li>
                  <li>
                    To protect or defend the legal rights or property of the
                    school, its website, or users.
                  </li>
                  <li>
                    To investigate, prevent, or take action regarding illegal
                    activities, suspected fraud, or potential threats to the
                    security and integrity of{" "}
                    <span className="font-semibold">
                      ST. ARNOLD'S CENTRAL SCHOOL (SACS)
                    </span>{" "}
                    and its website/offerings.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-lg underline font-semibold">
              Changes to our Privacy Policy
            </h4>
            {/* <ul className="list-disc list-inside mb-4"> */}
            <p>
              <span className="font-semibold">
                ST. ARNOLD'S CENTRAL SCHOOL (SACS)
              </span>{" "}
              reserves the entire right to modify/amend/remove this privacy
              statement anytime and without any reason. Nothing contained herein
              creates or is intended to create a contract/agreement between{" "}
              <span className="font-semibold">
                ST. ARNOLD'S CENTRAL SCHOOL (SACS)
              </span>{" "}
              and any user visiting the website or providing identifying
              information of any kind.
            </p>
            {/* </ul> */}

            <h3 className="text-lg font-semibold mt-4 underline ">
              Cancellation Policy
            </h3>
            <p className="mb-4">
              Right to cancel any fees/charges to{" "}
              <span className="font-semibold">
                ST. ARNOLD'S CENTRAL SCHOOL (SACS)
              </span>{" "}
              rests exclusively with{" "}
              <span className="font-semibold">
                ST. ARNOLD'S CENTRAL SCHOOL (SACS).
              </span>
              In the case of cancellation the user would get the amount of fees
              paid, however in no circumstances the Convenience Fees and the
              Service Tax would be refunded.
            </p>

            {/* <button
              onClick={handleCloseModal}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
              
            >
              Close
            </button> */}
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
