import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import heroImage from '../assets/hero_image4.png';
import { device } from '../styled/deviceBreakpoints';
import {
  HowItWorks,
  TopVolunteers,
  TopNonProfits,
} from '../components/LandingPage';
import { useStateValue } from '../hooks/useStateValue';
import { Input, message, Icon } from 'antd';
import { stateConversion } from '../utility/stateConversion';

const { Search } = Input;

export const LandingPage = () => {
  const [{ auth }] = useStateValue();
  const [location, setLocation] = useState('');

  const handleSearch = e => {};

  const handleChange = e => {
    setLocation(e.target.value);
  };
  useEffect(() => {
    axios
      .get(`https://geoip-db.com/json/${process.env.REACT_APP_ipinfoKey}`)
      .then(res => {
        let stateAbbrev = Object.keys(stateConversion).find(
          key => stateConversion[key] === res.data.state
        );
        let userCity = res.data.city;
        if (stateAbbrev) {
          setLocation(`${userCity}, ${stateAbbrev}`);
        } else {
          message.warning(
            'Unable to get your location. Please enter your state below.'
          );
        }
      })
      .catch(err => {
        console.log('Error detecting location');
        message.warning(
          'Unable to get your location. Please enter your state below.'
        );
      });
  }, []);

  return (
    <>
      <StyledHeroDiv image={heroImage} loggedIn={auth.loggedIn}>
        <HeroContent loggedIn={auth.loggedIn}>
          <p>
            Compete with friends, meet new ones, give back to the community.
          </p>
          <p style={{ marginBottom: '80px', marginTop: '20px' }}>Win-win.</p>
          <Search
            placeholder="Enter your city, state"
            onSearch={handleSearch}
            enterButton={
              <Link
                to={{
                  pathname: '/dashboard',
                  state: { userLocation: location },
                }}
              >
                <Icon type="search" />
              </Link>
            }
            size="large"
            onChange={handleChange}
            value={location}
          />
        </HeroContent>
      </StyledHeroDiv>
      <ContentDiv>
        <HowItWorks />
        <TopVolunteers />
        <TopNonProfits />
      </ContentDiv>
    </>
  );
};

export default LandingPage;

const StyledHeroDiv = styled.div`
  height: 50vh;
  width: ${({ loggedIn }) => loggedIn && '100vw'};
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${props => props.image});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100% 75%;
    filter: brightness(90%);
    @media ${device.tablet} {
      background-position: 50% 50%;
    }
  }
`;

const HeroContent = styled.div`
  width: 100%;
  text-align: center;
  color: white;
  z-index: 10;
  padding-right: ${({ loggedIn }) => loggedIn && '15rem'};

  @media ${device.laptop} {
  }

  @media ${device.tablet} {
  }

  & h1,
  p {
    color: white;
    margin: 0;
    font-size: 24px;
    padding: 0 20px;
  }
  
  .ant-input-search {
    width: 50%;
    min-width: 250px
    max-width: 350px;
  }

  button {
    background: ${({ theme }) => theme.accent};
    border-radius: inherit;
    border: 0;
    cursor: pointer;

    .anticon {
      font-size: 25px;
      padding-top: 5px;
    }
    &:hover {
      background: ${({ theme }) => theme.accent7};
    }

  }
`;

const ContentDiv = styled.div`
  max-width: 1305px;
  margin: 0 auto;
`;
