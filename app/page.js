import axios from "axios";
import dynamic from "next/dynamic";

// Dynamically import the Home component
const Home = dynamic(() => import("./Home"), { ssr: false });

export default async function Page() {
  let isSuccess = false;
  let data = [];

  try {
    const response = await axios.get(
      `https://brainy-quest.netlify.app/api/data`
    );
    // console.log("response: ", response);
    data = response.data.data.questions;
    isSuccess = true;
  } catch (error) {
    console.log("get data error: ", error);
    isSuccess = "error";
  }

  if (isSuccess === "error") return "Something went wrong";

  if (!isSuccess) return "Loading...";

  return <Home data={data} />;
}
