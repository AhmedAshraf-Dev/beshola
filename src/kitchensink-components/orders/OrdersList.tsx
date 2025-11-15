import React from "react";
import { List, AutoSizer } from "react-virtualized";
import "react-virtualized/styles.css";
import OrderCard from "../../components/cards/OrderCard";

export default function OrdersList({ rows, schemas, onEndReached }) {
  const rowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      <OrderCard order={rows[index]} schemas={schemas} />
    </div>
  );

  // detect end of list to trigger fetch more
  const handleScroll = ({ clientHeight, scrollHeight, scrollTop }) => {
    if (scrollHeight - scrollTop - clientHeight < 100) {
      onEndReached && onEndReached();
    }
  };

  return (
    <div style={{ height: "calc(100vh - 150px)" }}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowHeight={250} // approximate height of OrderCard
            rowCount={rows.length}
            rowRenderer={rowRenderer}
            overscanRowCount={5}
            onScroll={handleScroll}
          />
        )}
      </AutoSizer>
    </div>
  );
}
