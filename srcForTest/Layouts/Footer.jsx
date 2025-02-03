import { MdMarkEmailRead } from "react-icons/md";

const Footer = () => {
  return (
    <footer>
      <div
        className="flex flex-col  md:flex-row justify-between items-center text-white  shadow-lg  px-3"
        style={{
          backgroundColor: "#2196f3",
          // background: "black",
        }}
      >
        <div className=" md:mb-0 text-sm md:text-base pt-3 ">
          <p>Copyright © 2016-2018 Aceventura Services. All rights reserved.</p>
        </div>
        <div className=" md:mb-0 text-sm md:text-base pt-3">
          <p>
            <a
              href="/terms-and-conditions"
              className="text-white no-underline hover:underline "
            >
              Terms and conditions
            </a>
          </p>
        </div>
        <div className="text-sm md:text-base">
          <p>
            <a
              href="/contact-support"
              className="no-underline text-white flex items-center justify-center md:justify-start hover:underline pt-3"
            >
              <MdMarkEmailRead className="text-white text-lg mr-2 " />
              Contact for app support
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
