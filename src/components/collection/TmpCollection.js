/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import CollectionPropTypes from './Collection.propTypes';

// BREAKS!!!!!
// With Table.Row and rowData prop
// const TableRow = props => <Table.Row rowData={myReportsColumns(props)} />;

// return <TmpCollection rowComponent={TableRow} rows={myReports} />;
// export default function(props) {
//   const { rowKeyName = 'id', rowComponent: RowComponent, rows = [] } = props;

//   return (
//     <table>
//       <thead></thead>
//       <tbody>
//         {rows.map((row, i) => (
//           <RowComponent key={`${row[rowKeyName] || 'row'}-${i}`} {...row} index={i} />
//         ))}
//       </tbody>
//     </table>
//   );
// }

// BREAKS!!!!!
// const TableRow = props => (
//   <tr>
//     {myReportsColumns(props).map(i => (
//       <td>{i}</td>
//     ))}
//   </tr>
// );
// return <TmpCollection rowComponent={TableRow} rows={myReports} />;

// export default function(props) {
//   const { rowKeyName = 'id', rowComponent: RowComponent, rows = [] } = props;

//   return (
//     <table>
//       <thead></thead>
//       <tbody>
//         {rows.map((row, i) => (
//           <RowComponent key={`${row[rowKeyName] || 'row'}-${i}`} {...row} index={i} />
//         ))}
//       </tbody>
//     </table>
//   );
// }

// WORKS!!!!!
// return <TmpCollection columns={myReportsColumns} rows={myReports} />;

// export class TmpCollection extends Component {
//   render() {
//     const { rowKeyName = 'id', columns, rows = [] } = this.props;

//     if (rows.length === 0) return;

//     return (
//       <table>
//         <thead></thead>
//         <tbody>
//           {rows.map(row => (
//             <tr id={`report-${rowKeyName}`}>
//               {columns(row).map(i => (
//                 <td>{i}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }
// }
// TmpCollection.propTypes = CollectionPropTypes;

// export default TmpCollection;

// WORKS!!!!!
// let rows = myReports.map(report => {
//   return <tr key={report.id}>{myReportsColumns(report)}</tr>;
// });
// return <TmpCollection rows={rows} />;

// let rows = myReports.map(report => {
//   return (
//     <Table.Row key={report.id}>
//       {myReportsColumns(report).map(col => (
//         <td>{col}</td>
//       ))}
//     </Table.Row>
//   );
// });
// return <TmpCollection rows={rows} />;

export default function(props) {
  const { rows = [] } = props;

  return (
    <table>
      <thead></thead>
      <tbody>{rows}</tbody>
    </table>
  );
}
