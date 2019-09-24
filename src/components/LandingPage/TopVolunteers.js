import React from 'react';
import { Icon, Card } from 'antd';
import styled from 'styled-components';
import volunteerPic1 from '../../assets/volunteerPic1.png';
import volunteerPic2 from '../../assets/volunteerPic2.png';
import volunteerPic3 from '../../assets/volunteerPic3.png';
import volunteerPic4 from '../../assets/volunteerPic4.png';

export const TopVolunteers = () => {
  const { Meta } = Card;
  
  return (
    <StyledDiv>
      <h2>Leading volunteers<Icon type="fire" theme='filled' style={{ color: '#FA8C16' }}/></h2>
      <div className='volunteer-cards'>
        <StyledCard
          cover={<img src={volunteerPic1} alt='volunteer1'/>}
        >
          <Meta style={{width: '100%'}}title='Samira L.' description='10.25 hours/mo.'></Meta>
        </StyledCard>
        <StyledCard
          cover={<img src={volunteerPic2} alt='volunteer2'/>}
        >
          <Meta title='Henry R.' description='10 hours/mo.'></Meta>
        </StyledCard>
        <StyledCard
          cover={<img src={volunteerPic3} alt='volunteer3'/>}
        >
          <Meta title='Marielle W.' description='9.5 hours/mo.'></Meta>
        </StyledCard>
        <StyledCard
          cover={<img src={volunteerPic4} alt='volunteer4'/>}
        >
          <Meta title='Shawn B.' description='9.5 hours/mo.'></Meta>
        </StyledCard>
        <div className='volunteer-additional'>
          <Icon type="reconciliation" /><h6>More Volunteers</h6>
        </div>
      </div>
    </StyledDiv>
  )
}

export default TopVolunteers

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    font-size: 24px;
    color: ${({ theme }) => theme.primary};
    margin-bottom: 25px;
  }

  .volunteer-cards {
    display: flex;
    align-items: flex-end;

    .ant-card-body {
      padding: 4px;
    }

    .ant-card-meta-detail {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .ant-card-meta-title {
        margin: 0;
        font-size: 1.5rem;
      }
  
      .ant-card-meta-description {
        color: #FA8C16;
        font-size: 1rem;
        font-style: italic;
      }
    }

    .volunteer-additional {
      display: flex;
      align-items: center;

      h6 {
        margin: 0;
      }
    }
  }
`

const StyledCard = styled(Card)`
  margin: 0 1.6rem;
  background: #FFF7E6;
  width: 19%;
`
