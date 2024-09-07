import Slider from "@/lib/Swiper";
const data = [
  {
    id: 1,
    image:
      "https://dr10ftxu9axbn.cloudfront.net/eyJidWNrZXQiOiJtYXMtY29udGV4dC1pbWFnZXMiLCJrZXkiOiJtZWRpYS9tYXNfb2JzZXJ2YXRpb25zXzIwMjRfdGhlX2phcGFuZXNlX2hvdXNlX2luc2lkZV9hbmRfb3V0X25lbmRvXzAxLmpwZyIsImVkaXRzIjp7IndlYnAiOnsicXVhbGl0eSI6NjF9LCJyZXNpemUiOnsid2lkdGgiOjIwMDAsImhlaWdodCI6MTMzMywiZml0IjoiY292ZXIifX19",
    title: "The Japanesse house inside and out ",
    subtitle: "It may be a different movie, but one thing is sadly the same.",
    content:
      "Deadpool & Wolverine is attempting to be an MCU movie unlike any other, but there are some Marvel realities that are just unavoidable — like big explosions, quippy humor, and multiversal hijinks. The upcoming team-up adventure might be subverting Marvel’s classic post-credits scene, but it’s doubling down on another MCU habit — and undoing the progress made by previous Deadpool movies Since tickets for Deadpool & Wolverine are now available for purchase, theaters can disclose the new movie is 2 hours and 7 minutes long, making it the longest Deadpool movie of the three. However, it’s still just middle of the road for the MCU, placing it squarely between Doctor Strange in the Multiverse of Madness (2 hours 6 minutes) and Spider-Man: Far From Home (2 hours 10 minutes).",
    link: "",
    username: "BY DAIS JOHNSTON",
    date: "18 HOURS AGO",
    category: "Movies",
  },
  {
    id: 1,
    image:
      "https://dr10ftxu9axbn.cloudfront.net/eyJidWNrZXQiOiJtYXMtY29udGV4dC1pbWFnZXMiLCJrZXkiOiJtZWRpYS9tYXNfZXZlbnRfMjAyNF9pbnRvX3RoZV9xdWlldF9hbmRfdGhlX2xpZ2h0XzAxLmpwZyIsImVkaXRzIjp7IndlYnAiOnsicXVhbGl0eSI6NjF9LCJyZXNpemUiOnsid2lkdGgiOjIwMDAsImhlaWdodCI6MjUwMCwiZml0IjoiY292ZXIifX19",
    title: "The Japanesse house inside and out ",
    subtitle: "It may be a different movie, but one thing is sadly the same.",
    content:
      "Deadpool & Wolverine is attempting to be an MCU movie unlike any other, but there are some Marvel realities that are just unavoidable — like big explosions, quippy humor, and multiversal hijinks. The upcoming team-up adventure might be subverting Marvel’s classic post-credits scene, but it’s doubling down on another MCU habit — and undoing the progress made by previous Deadpool movies Since tickets for Deadpool & Wolverine are now available for purchase, theaters can disclose the new movie is 2 hours and 7 minutes long, making it the longest Deadpool movie of the three. However, it’s still just middle of the road for the MCU, placing it squarely between Doctor Strange in the Multiverse of Madness (2 hours 6 minutes) and Spider-Man: Far From Home (2 hours 10 minutes).",
    link: "",
    username: "BY DAIS JOHNSTON",
    date: "18 HOURS AGO",
    category: "Movies",
  },
  {
    id: 1,
    image:
      "https://dr10ftxu9axbn.cloudfront.net/eyJidWNrZXQiOiJtYXMtY29udGV4dC1pbWFnZXMiLCJrZXkiOiJtZWRpYS9tYXNfZXZlbnRfMjAyNF90aGVfamFwYW5lc2VfaG91c2Vfc2luY2VfMTk0NV93cmlnaHR3b29kXzY1OV8wMy5qcGciLCJlZGl0cyI6eyJ3ZWJwIjp7InF1YWxpdHkiOjYxfSwicmVzaXplIjp7IndpZHRoIjoyMDAwLCJoZWlnaHQiOjEzMzMsImZpdCI6ImNvdmVyIn19fQ==",
    title: "The Japanesse house inside and out ",
    subtitle: "It may be a different movie, but one thing is sadly the same.",
    content:
      "Deadpool & Wolverine is attempting to be an MCU movie unlike any other, but there are some Marvel realities that are just unavoidable — like big explosions, quippy humor, and multiversal hijinks. The upcoming team-up adventure might be subverting Marvel’s classic post-credits scene, but it’s doubling down on another MCU habit — and undoing the progress made by previous Deadpool movies Since tickets for Deadpool & Wolverine are now available for purchase, theaters can disclose the new movie is 2 hours and 7 minutes long, making it the longest Deadpool movie of the three. However, it’s still just middle of the road for the MCU, placing it squarely between Doctor Strange in the Multiverse of Madness (2 hours 6 minutes) and Spider-Man: Far From Home (2 hours 10 minutes).",
    link: "",
    username: "BY DAIS JOHNSTON",
    date: "18 HOURS AGO",
    category: "Movies",
  },
  {
    id: 1,
    image:
      "https://dr10ftxu9axbn.cloudfront.net/eyJidWNrZXQiOiJtYXMtY29udGV4dC1pbWFnZXMiLCJrZXkiOiJtZWRpYS9tYXNfb2JzZXJ2YXRpb25zXzIwMjRfdGhlX2NlbnR1cnlfYW5kX2NvbnN1bWVyc19idWlsZGluZ3NfMDEuanBnIiwiZWRpdHMiOnsid2VicCI6eyJxdWFsaXR5Ijo2MX0sInJlc2l6ZSI6eyJ3aWR0aCI6MjAwMCwiaGVpZ2h0IjoxNTAwLCJmaXQiOiJjb3ZlciJ9fX0=",
    title: "The Japanesse house inside and out ",
    subtitle: "It may be a different movie, but one thing is sadly the same.",
    content:
      "Deadpool & Wolverine is attempting to be an MCU movie unlike any other, but there are some Marvel realities that are just unavoidable — like big explosions, quippy humor, and multiversal hijinks. The upcoming team-up adventure might be subverting Marvel’s classic post-credits scene, but it’s doubling down on another MCU habit — and undoing the progress made by previous Deadpool movies Since tickets for Deadpool & Wolverine are now available for purchase, theaters can disclose the new movie is 2 hours and 7 minutes long, making it the longest Deadpool movie of the three. However, it’s still just middle of the road for the MCU, placing it squarely between Doctor Strange in the Multiverse of Madness (2 hours 6 minutes) and Spider-Man: Far From Home (2 hours 10 minutes).",
    link: "",
    username: "BY DAIS JOHNSTON",
    date: "18 HOURS AGO",
    category: "Movies",
  },
];
const Hero = () => {
  return (
    <div className="w-full min-h-screen relative ">
      <Slider data={data} />
    </div>
  );
};

export default Hero;
