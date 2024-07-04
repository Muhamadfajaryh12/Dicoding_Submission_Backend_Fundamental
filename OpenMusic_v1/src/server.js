require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const Inert = require("@hapi/inert");
const path = require("path");

const albums = require("./api/albums");
const songs = require("./api/songs");
const users = require("./api/users");
const collaborations = require("./api/collaborations");
const authentication = require("./api/authentication");
const playlists = require("./api/playlists");
const playlist_active = require("./api/playlists_active");
const _exports = require("./api/exports");
const uploads = require("./api/uploads");

const AlbumsService = require("./services/postgres/AlbumsServices");
const SongsService = require("./services/postgres/SongsServices");
const UsersService = require("./services/postgres/UserServices");
const AuthenticationService = require("./services/postgres/AuthenticationServices");
const CollaborationsService = require("./services/postgres/CollaborationServices");
const PlaylistsService = require("./services/postgres/PlaylistsServices");
const PlaylistActiveService = require("./services/postgres/PlaylistSongActivitiesServices");
const ProducerServices = require("./services/rabbitmq/ProducerServices");
const StorageService = require("./services/storage/StorageServices");
const CacheService = require("./services/redis/CacheServices");

const AlbumsValidator = require("./validator/albums");
const SongsValidator = require("./validator/songs");
const PlaylistsValidator = require("./validator/playlists");
const AuthenticationsValidator = require("./validator/authentication");
const CollaborationsValidator = require("./validator/collaborations");
const UsersValidator = require("./validator/users");
const ExportsValidator = require("./validator/exports");
const UploadsValidator = require("./validator/uploads");

const ClientError = require("./exceptions/ClientError");
const TokenManager = require("./tokenize/TokenManager");

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService(cacheService);
  const songsService = new SongsService();
  const collaborationsService = new CollaborationsService();
  const authenticationService = new AuthenticationService();
  const usersService = new UsersService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistActiveService = new PlaylistActiveService();
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy("authentication_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        songService: songsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationsService: authenticationService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        playlistsService: playlistsService,
        songsService: songsService,
        activitiesService: playlistActiveService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlist_active,
      options: {
        playlistsService: playlistsService,
        activitiesService: playlistActiveService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService: collaborationsService,
        playlistsService: playlistsService,
        usersService: usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exportsService: ProducerServices,
        playlistService: playlistsService,
        exportsValidator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        uploadsService: storageService,
        albumsService: albumsService,
        uploadsValidator: UploadsValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
