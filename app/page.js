import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import the Home component
const Home = dynamic(() => import("./Home"), { ssr: false });

export default async function Page() {
  let isSuccess = false;
  let data = [];
  let topic = "";

  // try {
  //   const response = await axios.get(
  //     `https://brainy-quest.netlify.app/api/data`,
  //     {
  //       params: { _t: Date.now() }, // Adding a unique timestamp
  //     }
  //   );
  //   // console.log("response: ", response.data);
  //   data = response.data.data.questions;
  //   topic = response.data.data.topic;
  //   isSuccess = true;
  // } catch (error) {
  //   console.log("get data error: ", error);
  //   isSuccess = "error";
  // }

  try {
    const response = await axios.get(
      `https://brainy-quest.netlify.app/api/data`,
      {
        params: { _t: Date.now() }, // Adding a unique timestamp to bypass caching
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0", // Explicitly disable caching
          Pragma: "no-cache", // For backward compatibility with HTTP/1.0
        },
      }
    );
    data = response.data.data.questions;
    topic = response.data.data.topic;
    isSuccess = true;
  } catch (error) {
    console.log("get data error: ", error);
    isSuccess = "error";
  }

  if (isSuccess === "error") return "Something went wrong";

  if (!isSuccess) return "Loading...";

  return <Home data={data} topic={topic} />;
}
