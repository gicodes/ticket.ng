import React from 'react';
import { Ticket } from '@/types/ticket';
import { Box, Chip } from '@mui/material';
import { getStatusColor, priorityColor } from '../_level_1/tColorVariants';

const TicketsList = ({
  tickets,
  openDetail,
}: {
  tickets: Ticket[];
  openDetail: (id: string | number) => void;
}) => {
  return (
    <Box py={3} px={2} maxWidth={'96vw'}>
      <Box
        sx={{
          my: 3,
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          borderRadius: 2,
          border: '0.1px solid var(--dull-gray)',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollBehavior: 'smooth',

          '&::-webkit-scrollbar': {
            height: 6,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'var(--secondary)',
            borderRadius: 10,
          },
          '@media (max-width: 600px)': {
            display: 'block',
            maxWidth: '90vw',
          },
        }}
      >
        <Box
          component="table"
          sx={{
            minWidth: 750,
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'auto',
          }}
        >
          <thead style={{ textAlign: 'left' }}>
            <tr>
              {['No.', 'Title', 'Priority', 'Type', 'Status', 'Last Updated'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--primary)',
                    color: 'var(--primary)',
                    borderBottom: '1px solid var(--secondary)',
                    zIndex: 1,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {tickets.map((t, i) => (
              <tr
                key={t.id}
                style={{
                  borderBottom: '0.1px solid var(--secondary)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => openDetail(t.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dull-gray)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  {i+1}
                </td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  {t.title}
                </td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  <Chip
                    label={t.priority}
                    size="small"
                    sx={{
                      backgroundColor: priorityColor(t.priority),
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                    }}
                  />
                </td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  {t.type==='FEATURE_REQUEST' ? 'FEATURE' : t.type}
                </td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  <Chip
                    label={t.status==="IN_PROGRESS" ? "IN PROGRESS" : t.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(t.status).bg,
                      color: getStatusColor(t.status).color,
                      fontWeight: 600,
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                    }}
                  />
                </td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketsList;