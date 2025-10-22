import React from 'react';
import { Ticket } from '@/types/ticket';
import { Box, Chip } from '@mui/material';
import { getStatusColor, getPriorityColor } from '../_level_1/tColorVariants';

const TicketsList = ({
  tickets,
  openDetail,
}: {
  tickets: Ticket[];
  openDetail: (id: string | number) => void;
}) => {
  return (
    <Box py={3} px={2}>
      <Box pt={{ xs: 3, md: 0}}>
        <h6>List view</h6>
      </Box>
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
              {['ID', 'Title', 'Priority', 'Type', 'Status', 'Updated'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 12px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--dull-gray)',
                    color: 'var(--surface-1)',
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
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onClick={() => openDetail(t.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dull-gray)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{i+1}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{t.title}</td>
                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                  <Chip
                    label={t.priority}
                    size="small"
                    sx={{
                      backgroundColor: getPriorityColor(t.priority).bg,
                      color: getPriorityColor(t.priority).color,
                      fontWeight: 600,
                      borderRadius: '8px',
                      textTransform: 'capitalize',
                    }}
                  />
                </td>

                <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{t.type==='FEATURE_REQUEST'}</td>
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