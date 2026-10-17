import { Fragment } from "react";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-10 ${className}`}>{children}</div>;
}

/** Renders "\n" in admin-edited headings as line breaks. */
export function Lines({ text }: { text: string }) {
  const parts = text.split("\n");
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p}
          {i < parts.length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: H = "h2",
  className = "",
  id,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  id?: string;
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <H id={id} className="mt-3 text-[1.85rem] font-extrabold leading-[1.08] sm:text-4xl lg:text-[2.6rem]">
        <Lines text={title} />
      </H>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-[17px]">{description}</p>}
    </div>
  );
}

/** Paragraphs split on blank lines. */
export function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`prose-body ${className}`}>
      {text
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{p}</p>
        ))}
    </div>
  );
}
