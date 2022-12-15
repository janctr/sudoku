import { Dispatch, SetStateAction } from "react";
import { Cell } from "../../types";

export default function SudokuCell(props: {
  isTakingNotes: boolean;
  coordinate: [number, number];
  cellValue: Cell;
  selectCell: (col: number, row: number) => void;
  selectedCell: [number, number] | null;
  clearSelectedCell: () => void;
  hoveredCell: [number, number] | null;
  setHoveredCell: Dispatch<SetStateAction<[number, number] | null>>;
  hoveredCellValue: number;
}) {
  const {
    isTakingNotes,
    coordinate,
    cellValue,
    selectCell,
    selectedCell,
    clearSelectedCell,
    hoveredCell,
    setHoveredCell,
    hoveredCellValue
  } = props;
  const [col, row] = coordinate;

  //const [isEditing, setIsEditing] = useState(false);

  // if (cellValue.value === 0) {
  //   if (isSelected()) {
  //     if (Array.isArray(cellValue.value)) {
  //       if (cellValue.value.length > 0) {
  //         cellValue = value;
  //       }
  //     }
  //   } else {
  //     cellValue = "";
  //   }
  // } else {
  //   cellValue = value;
  // }

  /** Event handlers */

  function handleOnClick() {
    console.log("yay im here")
    if (isSelected()) {
      clearSelectedCell();
    } else {
      const [col, row] = coordinate;
      selectCell(col, row);
    }
  }

  function handleMouseEnter() {
    setHoveredCell([col, row]);
  }

  function handleMouseLeave() {
    setHoveredCell(null);
  }

  /*************/

  function isSelected() {
    if (selectedCell) {
      const [selectedCol, selectedRow] = selectedCell;

      if (col === selectedCol && row === selectedRow) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if cell is within a row, column, or sub-matrix of currently hovered cell.
   */
  function isHovered(): boolean {
    if (!hoveredCell) return false;

    const [hoveredCellCol, hoveredCellRow] = hoveredCell;

    // Check column
    if (col === hoveredCellCol) return true;

    // Check row
    if (row === hoveredCellRow) return true;

    // Check matrix
    const hoveredCellColMatrix = Math.floor(hoveredCellCol / 3);
    const hoveredCellRowMatrix = Math.floor(hoveredCellRow / 3);

    const cellColMatrix = Math.floor(col / 3);
    const cellRowMatrix = Math.floor(row / 3);

    if (
      hoveredCellColMatrix === cellColMatrix &&
      hoveredCellRowMatrix === cellRowMatrix
    )
      return true;

    return false;
  }

  function getClassName() {
    let classNames = ["cell"];

    if (isSelected()) {
      classNames.push("selected-cell");
    }

    if (isHovered()) {
      classNames.push("hovered-cell");
    }

    if (cellValue.set) {
      classNames.push("set-cell");
    }

    if (hoveredCellValue !== 0 && cellValue.value === hoveredCellValue) {
      classNames.push('matching-number')
    }
    
    if (col % 3 === 0) classNames.push("col-boundary");

    return classNames.join(" ");
  }

  const cellClassName = getClassName();

  function CellValueComponent() {
    let value: string;

    if (isTakingNotes && cellValue.notes.length > 0) {
      value = cellValue.notes.join(", ");
    } else if (cellValue.value === 0) {
      value = "";
    } else {
      value = `${cellValue.value}`;
    }

    return <span className="cell-value">{value}</span>;
  }

  return (
    <span
      className={cellClassName}
      onClick={handleOnClick}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <CellValueComponent />
    </span>
  );
}
