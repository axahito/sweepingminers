import { useEffect, useRef } from "react";

type Props = {
  value: number;
};

const sevenSegmentsConfig = [
  ["a", "b", "c", "d", "e", "f"], //0
  ["c", "e"], // 1
  ["a", "c", "d", "f", "g"], // 2
  ["a", "c", "g", "e", "f"], // 3
  ["b", "c", "g", "e"], // 4
  ["a", "b", "g", "e", "f"], // 5
  ["a", "b", "g", "d", "e", "f"], // 6
  ["a", "c", "e"], // 7
  ["a", "b", "c", "d", "e", "f", "g"], // 8
  ["a", "b", "c", "f", "g", "e"], // 9
];

const SevenSegments = ({ value }: Props) => {
  const a = useRef<HTMLDivElement>(null);
  const b = useRef<HTMLDivElement>(null);
  const c = useRef<HTMLDivElement>(null);
  const d = useRef<HTMLDivElement>(null);
  const e = useRef<HTMLDivElement>(null);
  const f = useRef<HTMLDivElement>(null);
  const g = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const segments = { a, b, c, d, e, f, g };

    Object.entries(segments).forEach(([key, segment]) => {
      if (!segment.current) {
        return;
      }

      segment.current.classList.remove("active-segment");
      if (sevenSegmentsConfig[value].includes(key)) {
        segment.current.classList.add("active-segment");
      }
    });

    return () => {};
  }, [value]);

  return (
    <div className="w-[27.84px] h-[48px] relative flex justify-center">
      {/* a */}
      <div ref={a} className="top-0 segment-x" style={{}} />
      {/* b */}
      <div ref={b} className="top-[28.9473684211%] left-0 segment-y" />
      {/* c */}
      <div ref={c} className="top-[28.9473684211%] right-0 segment-y" />
      {/* g */}
      <div ref={g} className="top-1/2 translate-y-[-50%] segment-x" />
      {/* d */}
      <div
        ref={d}
        className="top-[71.0526315789%] left-0 translate-y-[-50%] segment-y"
      />
      {/* e */}
      <div
        ref={e}
        className="top-[71.0526315789%] right-0 translate-y-[-50%] segment-y"
      />
      {/* f */}
      <div ref={f} className="bottom-0 segment-x" />
    </div>
  );
};

export default SevenSegments;
