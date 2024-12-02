import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface TemplateDetailProps {}

const StyledTemplateDetail = styled.div`
  color: pink;
`;

export function TemplateDetail(props: TemplateDetailProps) {
  return (
    <StyledTemplateDetail>
      <h1>Welcome to TemplateDetail!</h1>
    </StyledTemplateDetail>
  );
}

export default TemplateDetail;
