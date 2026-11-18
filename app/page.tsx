import { redirect } from "next/navigation";

// 결정 D-S1-01, D-S1-09: `/` 접속 시 S1(/auth)로 보낸다.
export default function Home() {
  redirect("/auth");
}
