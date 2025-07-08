const journals = {
  generalScience: [
    {
      name: 'Nature',
      url: 'https://www.nature.com',
      rssUrl: 'https://www.nature.com/nature.rss',
      area: 'General Science',
      impact: 'High'
    },
    {
      name: 'Science',
      url: 'https://www.science.org',
      rssUrl: 'https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=science',
      area: 'General Science',
      impact: 'High'
    },
    {
      name: 'PNAS',
      url: 'https://www.pnas.org',
      rssUrl: 'https://www.pnas.org/rss/current.xml',
      area: 'General Science',
      impact: 'High'
    }
  ],
  physics: [
    {
      name: 'Physical Review Letters',
      url: 'https://journals.aps.org/prl/',
      rssUrl: 'https://journals.aps.org/rss/recent/prl.xml',
      area: 'Physics',
      impact: 'High'
    },
    {
      name: 'Nature Physics',
      url: 'https://www.nature.com/nphys/',
      rssUrl: 'https://www.nature.com/nphys.rss',
      area: 'Physics',
      impact: 'High'
    },
    {
      name: 'Physical Review X',
      url: 'https://journals.aps.org/prx/',
      rssUrl: 'https://journals.aps.org/rss/recent/prx.xml',
      area: 'Physics',
      impact: 'High'
    }
  ],
  biology: [
    {
      name: 'Cell',
      url: 'https://www.cell.com',
      rssUrl: 'https://www.cell.com/cell/current.rss',
      area: 'Biology',
      impact: 'High'
    },
    {
      name: 'Nature Biotechnology',
      url: 'https://www.nature.com/nbt/',
      rssUrl: 'https://www.nature.com/nbt.rss',
      area: 'Biology',
      impact: 'High'
    },
    {
      name: 'PLOS Biology',
      url: 'https://journals.plos.org/plosbiology/',
      rssUrl: 'https://journals.plos.org/plosbiology/feed/atom',
      area: 'Biology',
      impact: 'High'
    }
  ],
  chemistry: [
    {
      name: 'Nature Chemistry',
      url: 'https://www.nature.com/nchem/',
      rssUrl: 'https://www.nature.com/nchem.rss',
      area: 'Chemistry',
      impact: 'High'
    },
    {
      name: 'Journal of the American Chemical Society',
      url: 'https://pubs.acs.org/journal/jacsat',
      rssUrl: 'https://pubs.acs.org/action/showFeed?type=etoc&feed=rss&jc=jacsat',
      area: 'Chemistry',
      impact: 'High'
    },
    {
      name: 'Chemical Science',
      url: 'https://pubs.rsc.org/en/journals/journalissues/sc',
      rssUrl: 'https://pubs.rsc.org/en/journals/rss/SC',
      area: 'Chemistry',
      impact: 'High'
    }
  ],
  medicine: [
    {
      name: 'The Lancet',
      url: 'https://www.thelancet.com',
      rssUrl: 'https://www.thelancet.com/rssfeed/lancet_current.xml',
      area: 'Medicine',
      impact: 'High'
    },
    {
      name: 'New England Journal of Medicine',
      url: 'https://www.nejm.org',
      rssUrl: 'https://www.nejm.org/action/showFeed?type=etoc&feed=rss&jc=nejm',
      area: 'Medicine',
      impact: 'High'
    },
    {
      name: 'Nature Medicine',
      url: 'https://www.nature.com/nm/',
      rssUrl: 'https://www.nature.com/nm.rss',
      area: 'Medicine',
      impact: 'High'
    }
  ],
  engineering: [
    {
      name: 'Nature Engineering',
      url: 'https://www.nature.com/nateng/',
      rssUrl: 'https://www.nature.com/nateng.rss',
      area: 'Engineering',
      impact: 'High'
    },
    {
      name: 'Science Robotics',
      url: 'https://www.science.org/journal/scirobotics',
      rssUrl: 'https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=scirobotics',
      area: 'Engineering',
      impact: 'High'
    },
    {
      name: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
      url: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34',
      rssUrl: 'https://ieeexplore.ieee.org/rss/TOC34.XML',
      area: 'Engineering',
      impact: 'High'
    }
  ],
  environmental: [
    {
      name: 'Nature Climate Change',
      url: 'https://www.nature.com/nclimate/',
      rssUrl: 'https://www.nature.com/nclimate.rss',
      area: 'Environmental Science',
      impact: 'High'
    },
    {
      name: 'Environmental Science & Technology',
      url: 'https://pubs.acs.org/journal/esthag',
      rssUrl: 'https://pubs.acs.org/action/showFeed?type=etoc&feed=rss&jc=esthag',
      area: 'Environmental Science',
      impact: 'High'
    },
    {
      name: 'Global Environmental Change',
      url: 'https://www.journals.elsevier.com/global-environmental-change',
      rssUrl: 'https://rss.sciencedirect.com/publication/science/09593780',
      area: 'Environmental Science',
      impact: 'High'
    }
  ]
};

const getAllJournals = () => {
  return Object.values(journals).flat();
};

const getJournalsByArea = (area) => {
  return journals[area] || [];
};

const getAllAreas = () => {
  return Object.keys(journals);
};

module.exports = {
  journals,
  getAllJournals,
  getJournalsByArea,
  getAllAreas
}; 