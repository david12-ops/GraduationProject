import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { FC } from 'react';

function createData(
  socialniSite: string,
  podminkyUziti: string,
  doporuceneStranky: string,
) {
  return { socialniSite, podminkyUziti, doporuceneStranky };
}

const rows = [
  createData('Podmínky užití', 'Doporučeneé stránky', 'Facebook'),
  createData('Reklama', 'Práce v Livesportu', 'Twiter'),
  createData('Kontakt', 'FAQ', 'Instagram'),
  createData('Mobilní aplikace', 'Audio', ' '),
  createData('Livescore', ' ', ' '),
];

export const BasicTableOfFooter: FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ Width: 160, color: 'blue' }}>
        <TableHead>
          <TableRow>
            <TableCell component="th"></TableCell>
            <TableCell component="th"></TableCell>
            <TableCell component="th"></TableCell>
            <TableCell>TopFive</TableCell>
            <TableCell></TableCell>
            <TableCell>Sociální sítě</TableCell>
            <TableCell component="th"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.socialniSite}
              sx={{
                '&:last-child td, &:last-child th': {
                  borderRightStyle: 'none',
                },
              }}
            >
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
              <TableCell component="th"></TableCell>
              <TableCell component="th">{row.socialniSite}</TableCell>
              <TableCell component="th">{row.podminkyUziti}</TableCell>
              <TableCell component="th">{row.doporuceneStranky}</TableCell>
              <TableCell component="th"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
