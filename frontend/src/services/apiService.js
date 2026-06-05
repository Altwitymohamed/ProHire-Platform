import axios from 'axios';

export const getLiveStats = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/jobs/stats');
    return res.data;
  } catch (err) {
    return { jobs: 142, companies: 38, applicants: 850 };
  }
};
