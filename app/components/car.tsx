import React from "react";

export function CarWrapper({ children, name }: { name: string; children: React.ReactElement }) {
  const basement = React.Children.toArray(children.props.children);
  const firstTwoChildren = basement.slice(0, 2);
  const remainingChildren = basement.slice(2);

  return (
    <div className="rounded bg-blue-100 shadow">
      <div className="px-3 pt-1">{name}</div>

      <div className="grid grid-cols-2 gap-1 p-3 [&_button]:w-24 [&_button]:truncate">
        {firstTwoChildren}
      </div>

      {remainingChildren.length > 0 && (
        <div className="grid grid-cols-3 gap-1 p-3 [&_button]:w-16 [&_button]:truncate">
          {remainingChildren}
        </div>
      )}
    </div>
  );
}
