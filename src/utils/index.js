const mapDBToModelAlbums = ({ id, name, year, cover }) => ({
  id,
  name,
  year,
  coverUrl: cover,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

module.exports = { mapDBToModelSongs, mapDBToModelAlbums };
