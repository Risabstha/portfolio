import { useEffect, useReducer, useState, useRef } from "react";
import { useTheme } from "../stores/ThemeProvider";
import "../styles/Home.css";
import "animate.css";
import DownloadButton from "../components/DownloadButton";
import Symbol from "../components/Symbol";
import DotGrid from "../components/DotGrid";
import SquareBox from "../components/SquareBox";
import profile from "../assets/Profile.png";

// type type = "Full Stack Developer" | "Web Developer";
const texts = ["FullStack Developer", "Web Developer"];

const initialState: State = {
  index: 0,
  displayed: texts[0],
  phase: "pause",
};

interface State {
  index: number;
  displayed: string;
  phase: string;
}

type Action =
  | { type: "REMOVE_FRONT" }
  | { type: "START_TYPING" }
  | { type: "TYPE_NEXT" }
  | { type: "NEXT_WORD" }
  | { type: "START_REMOVING" };

// Reducer handles state transitions
function reducer(state: State, action: Action) {
  switch (action.type) {
    case "REMOVE_FRONT": {
      return { ...state, displayed: state.displayed.slice(1) }; // texk to first character lai remove garxa
    }
    case "START_TYPING": {
      return { ...state, phase: "typing" };
    }
    case "TYPE_NEXT": {
      const currentText = texts[state.index];
      return {
        ...state,
        displayed: currentText.slice(0, state.displayed.length + 1),
      }; // text ko character type garxa/ add garxa
    }
    case "NEXT_WORD": {
      const nextIndex = (state.index + 1) % texts.length; // index change garne
      return { index: nextIndex, displayed: "", phase: "typing" }; //These three values  define the entire new state.We don't need any of the old state values (...state)
    }
    case "START_REMOVING": {
      return { ...state, phase: "removing" };
    }
    default:
      return state;
  }
}

const Home = () => {
  // 3D hover effect on picture
  const imgRef = useRef(null);

  const handleMouseMove = (e: any) => {
    const img: any = imgRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Control rotation limits (smaller = subtle)
    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    img.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const img: any = imgRef.current;
    img.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  const { theme } = useTheme();

  const [state, dispatch] = useReducer(reducer, initialState);

  const [dotLength, setDotLength] = useState(25); // default

  useEffect(() => {
    const updateLength = () => {
      if (window.innerWidth < 896) {
        setDotLength(16);
      } else {
        setDotLength(25);
      }
    };

    updateLength(); // run once on mount
    window.addEventListener("resize", updateLength);
    return () => window.removeEventListener("resize", updateLength);
  }, []);

  // const texts = ["Full Stack Developer", "Web Developer"];
  // const [index, setIndex] = useState(0);
  // const [displayed, setDisplayed] = useState(texts[0]);
  // const [phase, setPhase] = useState("pause"); // "removing" | "typing" | "pause"

  // useEffect(() => {
  //   const current = texts[index];

  //   if (phase === "pause") {
  //     // initial pause before starting removing
  //     const timeout = setTimeout(() => setPhase("removing"), 2500); // 2.5s pause
  //     return () => clearTimeout(timeout);
  //   }

  //   if (phase === "removing") {
  //     if (displayed.length > 1) {
  //       const timeout = setTimeout(() => {
  //         setDisplayed(displayed.slice(1)); // remove from front, 0 index lai remove garxa ( 1 index dekhi last index samma lai display ma halxa)
  //       }, 100);
  //       return () => clearTimeout(timeout);
  //     } else {
  //       const timeout = setTimeout(() => {
  //         setPhase("typing");
  //         setIndex((prev) => (prev + 1) % texts.length); // here, texts.length is 2 and we are using mod(%)
  //       }, 500); // sabai text remove vaisake pachi 0.5 sec ma new text write garxa

  //       return () => clearTimeout(timeout);
  //     }
  //   }

  //   if (phase === "typing") {
  //     if (displayed.length < current.length) {
  //       // jaba displayed = Full Stack Develope , hunxa
  //       const timeout = setTimeout(() => {
  //         setDisplayed(current.slice(0, displayed.length + 1)); // yaha, displayed = Full Stack Developer, hunxa
  //       }, 150); // 150ms ma remove hunxa text
  //       return () => clearTimeout(timeout);
  //     } else {
  //       const timeout = setTimeout(() => {
  //         setPhase("removing");
  //       }, 2500); // full text write vaye pachi, 2.5 sec pachi text remove suru hunxa
  //       return () => clearTimeout(timeout);
  //     }
  //   }
  // }, [displayed, phase, index]);
  useEffect(() => {
    const currentText = texts[state.index];

    if (state.phase === "pause") {
      const timeout = setTimeout(() => {
        dispatch({ type: "START_REMOVING" });
      }, 2500);
      return () => clearTimeout(timeout);
    }

    if (state.phase === "removing") {
      if (state.displayed.length > 1) {
        const timeout = setTimeout(() => {
          dispatch({ type: "REMOVE_FRONT" });
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          dispatch({ type: "NEXT_WORD" });
        }, 500);
        return () => clearTimeout(timeout);
      }
    }

    if (state.phase === "typing") {
      if (state.displayed.length < currentText.length) {
        const timeout = setTimeout(() => {
          dispatch({ type: "TYPE_NEXT" });
        }, 150);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          dispatch({ type: "START_REMOVING" });
        }, 2500);
        return () => clearTimeout(timeout);
      }
    }
  }, [state.displayed, state.phase, state.index]);

  return (
    <div className="  font-['Fira_Code',monospace]">
      {/* Desktop view */}
      <div
        className="hidden md:flex md:justify-center 
      md:ml-[1.5rem] mdlg:ml-[1.65rem] lg:ml-[1.8rem] xl:ml-[2rem] 2xl:ml-[3rem]"
      >
        <div
          className="flex   
        2xl:w-[75vw] xl:w-[80vw] lg:w-[85vw] md:w-[88vw] 
        md:gap-[2rem] mdlg:gap-[2.5rem] lg:gap-[3rem]  xl:gap-[3.4rem]  
        pt-[10rem] px-4 "
        >
          <div
            className="w-[65vw]    
                      xl:space-y-4 lg:space-y-3.5 mdlg:space-y-3 md:space-y-2.5"
          >
            <div className="space-x-4">
              <p
                className={`md:text-[1.875rem]
                  mdlg:text-[2.1875rem] 
                  lg:text-[2.5rem] 
                  xl:text-[2.8125rem]
                  font-semibold`}
              >
                Hi, I am
              </p>
              <p
                className={`md:text-[1.875rem]
                  mdlg:text-[2.1875rem] 
                  lg:text-[2.5rem] 
                  xl:text-[2.8125rem]
                  font-semibold`}
              >
                Risab Shrestha.
              </p>
            </div>

            <p
              className="md:text-[1.375rem] 
            lg:text-[1.875rem]
            xl:text-[2rem] 
            font-semibold "
            >
              I am a{" "}
              <span
                className={` pr-1  ${
                  theme === "dark" ? "text-[#C778DD]" : "text-[#a840c5]"
                }`}
              >
                {state.displayed}
                <span className="animate-blink font-extralight">|</span>
              </span>
            </p>

            <p
              className="md:text-[1.02rem]
              mdlg:text-[1.06rem]
            lg:text-[1.125rem]
            xl:text-[1.25rem]
            font-medium"
            >
              I am a React developer who builds fast, smooth, and user-friendly
              web applications. I use the MERN stack to deliver full-stack
              solutions, turning complex problems into clean, efficient code.
              Always learning, always building.
            </p>

            <div
              className=" pt-3  w-[10rem] 
            animate__animated animate__slideInRight transition-all duration-600 ease-in-out"
            >
              <DownloadButton />
            </div>
          </div>

          <div className="w-[35vw] flex justify-center  ">
            <div
              className="relative  flex items-center
            xl:w-[20rem] 
            lg:w-[18rem] 
            mdlg:w-[16rem] 
            md:w-[14rem] "
            >
              <Symbol
                className="absolute
                        xl:top-12 xl:left-0 xl:w-[7.5rem] xl:h-[7.5rem]
                        lg:top-11.5 lg:left-0 lg:w-[7rem] lg:h-[7rem]
                        mdlg:top-12 mdlg:left-0 mdlg:w-[6.5rem] mdlg:h-[6.5rem]
                        md:top-12.5 md:left-0 md:w-[6rem]  md:h-[6rem]"
              />

              <div
                className="relative w-full perspective-[1000px]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <picture>
                  <source srcSet={profile} type="image/webp" />
                  {/* image lai relative banaune rw bottom ma place garne , ani image le svg rw dot lai cover garnxa */}
                  <img
                    ref={imgRef}
                    className={`rounded-[15%] transition-transform duration-200 ease-out w-full 
                            ${
                              theme === "dark"
                                ? "hover:shadow-[0_5px_20px_rgba(0,0,0,0.25)]"
                                : "hover:shadow-[0_10px_20px_rgba(0,0,0,0.25)]"
                            }`}
                    src={profile}
                    alt="profile"
                    fetchPriority="high" // image loading priority badhauna
                  />
                </picture>
              </div>

              {/* yeslai img mathi rakhyo vane yeslai img le xopxa */}
              <DotGrid
                length={dotLength}
                className="grid md:grid-cols-4 mdlg:grid-cols-5 gap-1 
                  w-22 h-22 absolute 
                  xl:top-75 xl:-right-8 xl:w-[5.5rem] xl:h-[5.5rem]
                  lg:top-68 lg:-right-7 lg:w-[5rem] lg:h-[5rem]
                  mdlg:top-60 mdlg:-right-6 mdlg:w-[4.5rem] mdlg:h-[4.5rem]
                  md:top-58 md:-right-6 md:w-[4rem] md:h-[4rem]
                  opacity-70"
              />
            </div>
          </div>
        </div>
      </div>

      {/* mobile view */}
      <div className="md:hidden flex justify-center pb-10">
        <div className=" w-[100vw] pt-[5rem] ">
          {/* <div className="flex justify-center  z-0"> */}
          <div className="relative z-[0] m-auto w-[15rem] flex justify-center ">
            <Symbol
              width={60}
              height={60}
              className={"absolute top-7 left-6"}
            />

            <div>
              <picture>
                <source srcSet={profile} type="image/webp" />
                {/* image lai relative banaune rw bottom ma place garne , ani image le svg rw dot lai cover garnxa */}
                <img
                  className="relative z-0  rounded-[15%] w-[12rem]"
                  src={profile}
                  alt="profile image"
                  fetchPriority="high"
                />
              </picture>
            </div>

            {/* yeslai img mathi rakhyo vane yeslai img le xopxa */}
            <DotGrid
              length={16}
              className="grid grid-cols-4 gap-1 
                w-13 h-13 
                absolute top-43  -right-1 z-0 opacity-60"
            />
          </div>
          {/* </div> */}

          <div className="flex flex-col items-center pt-5">
            <p className={`text-[30px]  font-semibold`}>Hi, I am</p>
            <p className={`text-[30px] font-semibold `}>Risab Shrestha</p>

            <p className="text-[20px]  font-semibold ">
              I am a{" "}
              <span
                className={` pr-1  ${
                  theme === "dark" ? "text-[#C778DD]" : "text-[#a840c5]"
                }`}
              >
                {state.displayed}
                <span className="animate-blink font-extralight"> | </span>
              </span>
            </p>

            <p className="text-md text-center font-medium pt-4 w-[94vw] ">
              Hi! I am a web app developer passionate about building
              cross-platform apps with React. I focus on creating smooth,
              user-friendly experiences for web application. I also work with
              the MERN stack to build full solutions when needed. I love solving
              real-world problems and exploring new tech along the way.
            </p>
            <div
              className=" pt-3 mt-2 w-[8rem]  
            animate__animated animate__slideInRight transition-all duration-600 ease-in-out"
            >
              <DownloadButton />
            </div>
          </div>
        </div>
      </div>

      {/* square svg */}
      <SquareBox
        className={`hidden md:block absolute 
                    2xl:top-[40rem] xl:top-[40rem] md:right-0 lg:top-[38rem] md:top-[36rem]
                    2xl:w-[5rem]
                    xl:w-[4rem] xl-h-[4rem]
                    lg:w-[3.2rem] lg-h-[3rem]
                    md:w-[2rem] md-h-[2rem]`}
        viewBox="0 0 59 91"
      />
    </div>
  );
};

export default Home;
