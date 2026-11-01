'use client';

import styled from 'styled-components';
import { INSTALL_URL } from '@/lib/site';

type InstallButtonProps = {
  size?: 'small' | 'large';
  label?: string;
};

const Button = styled.a<{ $size: 'small' | 'large' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  white-space: nowrap;

  ${({ $size }) =>
    $size === 'large' &&
    `
    padding: 8px 26px;
    border-radius: 10px;
    font-size: 15px;
    letter-spacing: 0.02em;
  `}
`;

const Arrow = styled.span`
  font-size: 0.9em;
`;

const InstallButton = ({ size = 'small', label = 'Install Free' }: InstallButtonProps) => (
  <Button className="lz-button lz-button--primary" href={INSTALL_URL} $size={size}>
    {label}
    {size === 'large' && <Arrow aria-hidden>▶</Arrow>}
  </Button>
);

export default InstallButton;
