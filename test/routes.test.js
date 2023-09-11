import { describe, it, expect, vi } from "vitest";

import { handler } from '../server/routes/index.js'
import config from '../server/config.js';

import { Controller } from "../server/controller/index.js";

import TestUtil from "./_utils/testUtil.js";

describe('#Routes - test site for API response', () => {
  it('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = 'GET';
    params.request.url = '/';

    await handler(...params.values());
    expect(params.response.writeHead).toBeCalledWith(302, { 'Location': config.location.home });
    expect(params.response.end).toHaveBeenCalled();
  });

  it(`GET /home - should response with ${config.pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = 'GET';
    params.request.url = '/home';

    const mockFileStream = TestUtil.generateReadbleStream(['data']);

    vi.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({
      stream: mockFileStream
    });

    vi.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(config.pages.homeHTML);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  it(`GET /controller - should response with ${config.pages.controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = 'GET';
    params.request.url = '/controller';

    const mockFileStream = TestUtil.generateReadbleStream(['data']);

    vi.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({
      stream: mockFileStream
    });

    vi.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(config.pages.controllerHTML);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
  });

  it(`GET /index.html - should response with file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const fileName = '/index.html'

    params.request.method = 'GET';
    params.request.url = fileName;

    const expectType = '.html';
    const mockFileStream = TestUtil.generateReadbleStream(['data']);

    vi.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({
      stream: mockFileStream,
      type: expectType
    });

    vi.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).toBeCalledWith(200, { 'Content-Type': config.constants.CONTENT_TYPE[expectType] })
  });

  it(`GET /file.ext - should response with file stream`, async () => {
    const params = TestUtil.defaultHandleParams();
    const fileName = '/file.ext'

    params.request.method = 'GET';
    params.request.url = fileName;

    const expectType = 'ext';
    const mockFileStream = TestUtil.generateReadbleStream(['data']);

    vi.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({
      stream: mockFileStream,
      type: expectType
    });

    vi.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handler(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(fileName);
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    expect(params.response.writeHead).not.toHaveBeenCalled();
  });

  it(`GET /unknown - given an inexistent route it should response with 404`, async () => {
    const params = TestUtil.defaultHandleParams();

    params.request.method = 'POST';
    params.request.url = '/unknown';

    await handler(...params.values());

    expect(params.response.writeHead).toBeCalledWith(404);
    expect(params.response.end).toHaveBeenCalled();
  });

  describe('#Exceptions', () => {
    it(`given an inexistent file it should response with 404`, async () => {
      const params = TestUtil.defaultHandleParams();
  
      params.request.method = 'GET';
      params.request.url = '/index.png';
  
      vi.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockRejectedValue(
        new Error('Error: ENOENT')
      );

      await handler(...params.values());
  
      expect(params.response.writeHead).toBeCalledWith(404);
      expect(params.response.end).toHaveBeenCalled();
    });

    it(`given an error it should response with 500`, async () => {
      const params = TestUtil.defaultHandleParams();
  
      params.request.method = 'GET';
      params.request.url = '/index.png';
  
      vi.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockRejectedValue(
        new Error('Error:')
      );

      await handler(...params.values());
  
      expect(params.response.writeHead).toBeCalledWith(500);
      expect(params.response.end).toHaveBeenCalled();
    });
  });
});