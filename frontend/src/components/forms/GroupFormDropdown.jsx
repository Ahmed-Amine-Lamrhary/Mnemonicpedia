import React from "react";
import FormGroup from "./GroupForm";

function GroupFormDropdown({
  label,
  value,
  items,
  onChange,
  onSelect,
  selected,
}) {
  return (
    <>
      {selected.map((item) => (
        <span key={item._id}>{item.name}</span>
      ))}

      <FormGroup type="text" value={value} label={label} onChange={onChange} />
      {items.map((item) => (
        <button type="button" key={item._id} onClick={() => onSelect(item)}>
          {item.name}
        </button>
      ))}
    </>
  );
}

export default GroupFormDropdown;
